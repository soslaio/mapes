
import datetime
from django.test import TestCase
from .models import Consulta, Medico, Exame
from django.test import Client
from django.urls import reverse


class CoreModelTests(TestCase):

    def setUp(self):
        self.client = Client()
        medico = Medico.objects.create(nome_medico="Breno Murphy")
        self.consulta = Consulta.objects.create(medico=medico, data_consulta=datetime.date(2019, 1, 1),
                                                valor_consulta=90)
        Exame.objects.create(consulta=self.consulta, nome_exame="Endoscopia", valor_exame=250.32)
        Exame.objects.create(consulta=self.consulta, nome_exame="Ultrassom Abdomen", valor_exame=178.5)

    def test_se_atributos_formatados_estao_corretos(self):
        self.assertEqual(self.consulta.valor_consulta_formatado, "R$ 90,00")
        self.assertEqual(self.consulta.data_consulta_formatada, "01/01/2019")

    def test_se_valores_dos_atributos_estao_corretos(self):
        self.assertEqual(self.consulta.qtde_exames, 2)
        self.assertEqual(self.consulta.gasto_consulta, 428.82)

    def test_se_rota_do_graphql_esta_respondendo(self):
        url = reverse('graphql')
        response = self.client.get(url, {'query': '{ todosMedicos { id nomeMedico } }'})
        self.assertEqual(response.status_code, 200)
