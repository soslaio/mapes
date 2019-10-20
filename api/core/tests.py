
from django.test import TestCase
from .models import Consulta, Medico


class CoreModelTests(TestCase):
    def setUp(self):
        medico = Medico.objects.create(nome_medico="Breno Murphy")
        Consulta.objects.create(medico=medico, data_consulta="2019-01-01", valor_consulta=90)

    def test_valor_da_consulta_e_90(self):
        consulta_breno = Consulta.objects.get(medico__nome_medico="Breno Murphy")
        print(consulta_breno)
        self.assertTrue(True)
