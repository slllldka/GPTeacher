from django.db import models
from problem_manage_app.models import *

# Create your models here.

class Hint(models.Model):
    problem_id = models.ForeignKey(Problem, to_field='id', on_delete=models.CASCADE)
    key_text = models.TextField()
    key_text_start_idx = models.IntegerField()
    key_text_end_idx = models.IntegerField()
    description = models.TextField()