import os 
# import os Prepara o código para interação com o sistema operacional
class Config:
    # conexão com o banco de dados
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/eniactech'

        # Trocar "root:123456" pelos dados reais do banco de dados
    SQLALCHEMY_TRACK_MODIFICATIONS = False # desativa rastreamento de alterações, economiza memória
    SECRET_KEY = os.getenv('SECRET_KEY', 'chave_secreta_Flask') 
    # chave secreta para segurança da aplicação