
from django.db import models


def formatar_moeda(valor):
    """Esse método foi escolhido devido não possuir importes e não depende de configurações de ambiente,
       que não passaram em todos os cenários de teste verificados."""
    a = '{:,.2f}'.format(valor)
    b = a.replace(',', 'v')
    c = b.replace('.', ',')
    d = c.replace('v', '.')
    return f'R$ {d}'


class Medico(models.Model):
    nome_medico = models.CharField(max_length=200)

    class Meta:
        ordering = ['nome_medico']

    def __str__(self):
        return self.nome_medico


class Consulta(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='consultas')
    data_consulta = models.DateField()
    valor_consulta = models.DecimalField(decimal_places=2, max_digits=11)

    @property
    def valor_consulta_formatado(self):
        return formatar_moeda(self.valor_consulta)

    @property
    def data_consulta_formatada(self):
        return self.data_consulta.strftime('%d/%m/%Y')

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

    @property
    def gasto_consulta_formatado(self):
        return formatar_moeda(self.gasto_consulta)

    def __str__(self):
        return f'{self.data_consulta} - {self.medico.nome_medico}'


class Exame(models.Model):
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE, related_name='exames')
    nome_exame = models.CharField(max_length=200, null=True, blank=True)
    valor_exame = models.DecimalField(decimal_places=2, max_digits=11)

    def __str__(self):
        return f'{self.consulta} - {self.nome_exame}'
