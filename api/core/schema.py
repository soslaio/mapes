
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

    def resolve_gasto_consulta(self, info):
        return self.gasto_consulta

    def resolve_num_guia_consulta(self, info):
        return self.num_guia_consulta

    def resolve_qtde_exames(self, info):
        return self.qtde_exames


class ExameType(DjangoObjectType):
    class Meta:
        model = Exame


class Query(object):

    todos_medicos = graphene.List(MedicoType)
    todas_consultas = graphene.List(ConsultaType)
    consultas_medico = graphene.List(ConsultaType, id_medico=graphene.Int())
    consultas_periodo = graphene.List(ConsultaType, data_inicio=graphene.Date(), data_fim=graphene.Date())

    def resolve_todos_medicos(self, info, **kwargs):
        return Medico.objects.all()

    def resolve_todas_consultas(self, info, **kwargs):
        return sorted(Consulta.objects.all(), key=lambda c: c.gasto_consulta)

    def resolve_consultas_medico(self, info, id_medico):
        return Consulta.objects.filter(medico__id=id_medico)

    def resolve_consultas_periodo(self, info, data_inicio, data_fim):
        return Consulta.objects.filter(data_consulta__range=(data_inicio, data_fim))
