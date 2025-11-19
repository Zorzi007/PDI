from flask import Blueprint, request, jsonify
from extensions import db
from models.user_model import Aluno

alunos_bp = Blueprint('alunos', __name__)

# LISTAR alunos (GET)
@alunos_bp.route('/', methods=['GET'])
def listar_alunos():
    alunos = Aluno.query.all()
    return jsonify([{
        "id": aluno.id,
        "nome": aluno.nome,
        "email": aluno.email
    } for aluno in alunos])

# CADASTRAR aluno (POST)
@alunos_bp.route('/', methods=['POST'])
def cadastrar_aluno():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not email or not senha:
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    novo_aluno = Aluno(nome=nome, email=email, senha=senha)
    db.session.add(novo_aluno)
    db.session.commit()

    return jsonify({"message": "Aluno cadastrado com sucesso!"}), 201