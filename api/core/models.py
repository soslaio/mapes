
from django.db import models


class Medico(models.Model):
    nome_medico = models.CharField(max_length=200)

    def __str__(self):
        return self.nome_medico


class Consulta(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='consultas')
    data_consulta = models.DateField()
    valor_consulta = models.DecimalField(decimal_places=2, max_digits=11)

    @property
    def num_guia_consulta(self):
        return self.id

    @property
    def qtde_exames(self):
        return len(self.exames.all())

    @property
    def gasto_consulta(self):
        total = 0.0
        if self.qtde_exames > 0:
            for exame in self.exames.all():
                total += float(exame.valor_exame)
        return total

    def __str__(self):
        return f'{self.data_consulta} - {self.medico.nome_medico}'


class Exame(models.Model):
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE, related_name='exames')
    nome_exame = models.CharField(max_length=200, null=True, blank=True)
    valor_exame = models.DecimalField(decimal_places=2, max_digits=11)
