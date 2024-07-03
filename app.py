import traceback
from datetime import datetime

from RestrictedPython import compile_restricted, safe_globals, utility_builtins
from RestrictedPython.Eval import default_guarded_getiter, default_guarded_getitem
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Activer CORS pour toutes les routes


class Session(object):
    def __init__(self, id: str, ip: int, is_test: bool, user_agent: str):
        self.id: str = id
        self.ip: int = ip
        self.is_test: bool = is_test
        self.user_agent: str = user_agent


class VisitorEvent(object):
    def __init__(self,
                 id: int,
                 client_id: str,
                 page_id: str,
                 variant_id: str,
                 is_conversion: bool,
                 is_personalized: bool,
                 display_group: str,
                 event_type: str,
                 payload: dict,
                 path: str,
                 happened_at: datetime,
                 session: Session):
        self.id = id
        self.client_id = client_id
        self.page_id = page_id
        self.variant_id = variant_id
        self.is_conversion = is_conversion
        self.is_personalized = is_personalized
        self.display_group = display_group
        self.event_type = event_type
        self.payload = payload
        self.path = path
        self.happened_at = happened_at
        self.session = session


@app.route('/eval', methods=['GET'])
def eval_code():
    # Récupérer le corps de la requête
    code = request.data.decode('utf-8')

    try:
        # Séparation des lignes de code
        lines = code.split('\n')

        # Code à exécuter (toutes les lignes sauf la dernière)
        exec_code = '\n'.join(lines[:-1])

        # Ligne de retour (évaluation de l'expression après "return")
        return_expr = lines[-1].replace('return ', '')

        # Compilation du code avec RestrictedPython
        exec_code_compiled = compile_restricted(exec_code, '<string>', 'exec')
        return_expr_compiled = compile_restricted(return_expr, '<string>', 'eval')

        # Définir un environnement sécurisé
        restricted_globals = {
            '__builtins__': safe_globals['__builtins__'],
            '_getiter_': default_guarded_getiter,
            '_getitem_': default_guarded_getitem,
        }

        # creation de l'event mock
        local_vars = {
            'event': getMockVisitorEvent(),
        }

        restricted_globals.update(utility_builtins)

        try:
            # Exécution du code compilé
            exec(exec_code_compiled, restricted_globals, local_vars)

            # Évaluation de l'expression de retour compilée
            result = eval(return_expr_compiled, restricted_globals, local_vars)

            # Retourner le résultat en format JSON
            return jsonify(result=result)

        except Exception as exec_e:
            # Gestion des erreurs d'exécution avec détails
            return jsonify(error=str(exec_e), line=extract_line_number()), 400

    except SyntaxError as syntax_e:
        msg = syntax_e.msg[0]
        # remove first 8 characters from the error message
        msg = msg[8:]
        # Gestion des erreurs de compilation avec détails
        return jsonify(error=msg, line=len(lines) + 1), 400


def extract_line_number():
    traceback_str = traceback.format_exc()
    # Extraire le numéro de ligne de la trace de pile
    for line in traceback_str.split('\n'):
        if 'File "<string>", line ' in line:
            return int(line.split('line ')[1].split(',')[0])

    return None


def getMockVisitorEvent() -> VisitorEvent:
    session = Session(
        id="generic_session_uuid",
        ip=1234567890,
        is_test=False,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    )

    return VisitorEvent(
        id=1,
        client_id="generic_client_uuid",
        page_id="generic_page_uuid",
        variant_id="generic_variant_uuid",
        is_conversion=False,
        is_personalized=False,
        display_group="generic_display_group",
        event_type="generic_event_type",
        payload={},
        path="/home/generic/path",
        happened_at=datetime.now(),
        session=session
    )


if __name__ == '__main__':
    app.run(debug=True, port=5050)
