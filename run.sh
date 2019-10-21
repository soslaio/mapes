sudo docker-compose -f stack.yml up -d
sudo docker exec -it mapesapi sh -c "python manage.py migrate"
sudo docker exec -it mapesapi sh -c "echo \"from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')\" | python manage.py shell"
