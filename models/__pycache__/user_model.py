from extensions import db
#Criando a tabela de alunos no SQLAlchemy
class Aluno(db.Model):
    _tablename_ = 'aluno'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    curso = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    semestre = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "curso": self.curso,
            "email": self.email,
            "semestre": self.semestre
        }