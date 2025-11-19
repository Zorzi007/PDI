from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Configura CORS para aceitar tudo
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)

    # Importa e registra o blueprint
    from routes.alunos import alunos_bp
    app.register_blueprint(alunos_bp, url_prefix='/alunos')

    @app.route('/formCadastro')
    def home():
        return {'status': 'API do Plano de Carreira ENIAC está rodando 🚀'}

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)