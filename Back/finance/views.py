from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        income = Transaction.objects.filter(transaction_type='IN').aggregate(total=Sum('amount'))['total'] or 0
        expenses = Transaction.objects.filter(transaction_type='OUT').aggregate(total=Sum('amount'))['total'] or 0
        balance = income - expenses
        return Response({
            'income': float(income),
            'expenses': float(expenses),
            'balance': float(balance)
        })