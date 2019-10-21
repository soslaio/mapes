
FROM python:3.6-slim-buster

# Atualizações do sistema.
RUN apt-get -y update
RUN apt-get -y upgrade

# Copia os arquivos necessários para a construção da imagem.
COPY api /opt/api
COPY api/requirements.txt /opt/api/requirements.txt

# Instala os módulos python requeridos para a aplicação.
WORKDIR /opt/api/
RUN pip install -r requirements.txt

WORKDIR /opt/api/
RUN python manage.py migrate
RUN echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python manage.py shell
