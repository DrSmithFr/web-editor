.PHONY: build start reload

build:
	docker build -t python-evaluator .

start:
	docker run --rm -p 5050:5050 python-evaluator

reload: build start
