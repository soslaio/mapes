
import graphene
from graphene_django.types import DjangoObjectType
from core.models import Medico, Consulta, Exame


class MedicoType(DjangoObjectType):
    class Meta:
        model = Medico


class ConsultaType(DjangoObjectType):
    class Meta:
        model = Consulta


class ExameType(DjangoObjectType):
    class Meta:
        model = Exame


class Query(object):

    todos_medicos = graphene.List(MedicoType)

    def resolve_todos_medicos(self, info, **kwargs):
        return Medico.objects.all()
