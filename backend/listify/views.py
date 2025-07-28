from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
 
def listify(request):
    return HttpResponse("This is the listify view.")
 