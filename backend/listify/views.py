
from django.shortcuts import render

def listify(request):
  return render(request, 'listify.html')