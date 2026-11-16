from django.db import models

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('IN', 'Receita'),
        ('OUT', 'Despesa'),
    )

    title = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=3, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, default='Geral')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.transaction_type}): R$ {self.amount}"