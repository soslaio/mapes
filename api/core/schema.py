
import graphene
from graphene_django.types import DjangoObjectType
from core.models import Medico, Consulta, Exame


class MedicoType(DjangoObjectType):
    class Meta:
        model = Medico


class ConsultaType(DjangoObjectType):
    class Meta:
        model = Consulta

    # Adição das properties do modelo.
    gasto_consulta = graphene.Float()
    num_guia_consulta = graphene.String()
    qtde_exames = graphene.Int()
    data_consulta_formatada = graphene.String()
    valor_consulta_formatado = graphene.String()
    gasto_consulta_formatado = graphene.String()

    def resolve_gasto_consulta(self, info):
        return self.gasto_consulta

    def resolve_num_guia_consulta(self, info):
        return self.num_guia_consulta

    def resolve_qtde_exames(self, info):
        return self.qtde_exames

    def resolve_data_consulta_formatada(self, info):
        return self.data_consulta_formatada

    def resolve_valor_consulta_formatado(self, info):
        return self.valor_consulta_formatado

    def resolve_gasto_consulta_formatado(self, info):
        return self.gasto_consulta_formatado


class ExameType(DjangoObjectType):
    class Meta:
        model = Exame


class Query(object):

    todos_medicos = graphene.List(MedicoType)
    consultas = graphene.List(ConsultaType, id_medico=graphene.String(), data_inicio=graphene.String(),
                              data_fim=graphene.String())

    def resolve_todos_medicos(self, info, **kwargs):
        return Medico.objects.all()

    def resolve_consultas(self, info, id_medico=None, data_inicio=None, data_fim=None):
        consultas = Consulta.objects.all()

        if id_medico:
            consultas = consultas.filter(medico__id=id_medico)

        if data_inicio and data_fim:
            consultas = consultas.filter(data_consulta__range=(data_inicio, data_fim))

        return sorted(consultas, key=lambda c: c.gasto_consulta, reverse=True)
