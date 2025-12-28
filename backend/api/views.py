from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer
from django.db.models import Sum
from datetime import datetime, timedelta
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    
    # Calculate this month's spending
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Calculate this month's income
    month_income = Transaction.objects.filter(
        user=user, 
        transaction_type='income',
        transaction_date__gte=month_start
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Calculate this month's expenses
    month_expenses = Transaction.objects.filter(
        user=user, 
        transaction_type='expense',
        transaction_date__gte=month_start
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Calculate this month's balance (income - expenses)
    month_balance = month_income - month_expenses
    
    # Calculate last month's spending for comparison
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_end = month_start - timedelta(days=1)
    last_month_expenses = Transaction.objects.filter(
        user=user,
        transaction_type='expense', 
        transaction_date__gte=last_month_start,
        transaction_date__lte=last_month_end
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Calculate percentage change
    if last_month_expenses > 0:
        percentage_change = ((month_expenses - last_month_expenses) / last_month_expenses) * 100
        has_comparison = True
    else:
        percentage_change = 0
        has_comparison = False
    
    # Calculate streak (days with no spending)
    streak = 0
    current_date = now.date()
    while True:
        day_expenses = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            transaction_date__date=current_date
        ).exists()
        if not day_expenses:  # No spending = streak continues
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    # Calculate mood based on month expense percentage compared to month income
    if month_income == 0:
        mood = {'emoji': '💀', 'text': 'Dead'}
    else:
        expense_percentage = (month_expenses / month_income) * 100
        
        if expense_percentage <= 25:
            mood = {'emoji': '😎', 'text': 'Excellent'}
        elif expense_percentage <= 40:
            mood = {'emoji': '😊', 'text': 'Good'}
        elif expense_percentage <= 60:
            mood = {'emoji': '😐', 'text': 'Okay'}
        elif expense_percentage <= 80:
            mood = {'emoji': '😰', 'text': 'Worried'}
        else:
            mood = {'emoji': '💀', 'text': 'Dead'}
    
    return Response({
        'message': f'Welcome {user.username}!',
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'wallet_balance': float(month_balance),
        'month_spending': float(month_expenses),
        'month_income': float(month_income),
        'spending_change': {
            'percentage': round(percentage_change, 1),
            'direction': 'up' if percentage_change > 0 else 'down' if percentage_change < 0 else 'same',
            'has_comparison': has_comparison
        },
        'streak': streak,
        'mood': mood
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    user = request.user
    now = timezone.now()
    
    # Category-wise spending
    category_spending = Transaction.objects.filter(
        user=user, 
        transaction_type='expense'
    ).values('category__name', 'category__emoji').annotate(
        total=Sum('amount')
    ).order_by('-total')
    
    # Monthly spending trend (last 6 months)
    monthly_data = []
    for i in range(6):
        month_start = (now.replace(day=1) - timedelta(days=i*30)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        month_spending = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            created_at__gte=month_start,
            created_at__lte=month_end
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        monthly_data.append({
            'month': month_start.strftime('%b'),
            'amount': float(month_spending)
        })
    
    # Income vs Expense
    total_income = Transaction.objects.filter(user=user, transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = Transaction.objects.filter(user=user, transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    
    return Response({
        'category_spending': list(category_spending),
        'monthly_trend': list(reversed(monthly_data)),
        'income_vs_expense': {
            'income': float(total_income),
            'expenses': float(total_expenses)
        }
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def transactions(request):
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user)
        
        # Apply filters
        transaction_type = request.GET.get('type')
        category_id = request.GET.get('category')
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        amount_min = request.GET.get('amount_min')
        amount_max = request.GET.get('amount_max')
        
        if transaction_type:
            transactions = transactions.filter(transaction_type=transaction_type)
        
        if category_id:
            transactions = transactions.filter(category_id=category_id)
        
        if date_from:
            transactions = transactions.filter(transaction_date__gte=date_from)
        
        if date_to:
            transactions = transactions.filter(transaction_date__lte=date_to)
        
        if amount_min:
            transactions = transactions.filter(amount__gte=amount_min)
        
        if amount_max:
            transactions = transactions.filter(amount__lte=amount_max)
        
        transactions = transactions.order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            # Use provided transaction_date or default to now
            transaction_data = serializer.validated_data
            if 'transaction_date' not in request.data:
                transaction_data['transaction_date'] = timezone.now()
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)