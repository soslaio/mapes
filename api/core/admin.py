
from django.contrib import admin
from .models import Consulta, Exame, Medico

admin.site.register(Medico)
admin.site.register(Exame)


@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display = ('medico', 'num_guia_consulta', 'data_consulta', 'valor_consulta', 'gasto_consulta', 'qtde_exames')
