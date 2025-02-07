from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver

# Create your models here.

class Problem(models.Model):
    id = models.AutoField()
    user_id = models.BigIntegerField()
    title = models.CharField(max_length=128)
    problem_description = models.TextField()
    input_description = models.TextField()
    output_description = models.TextField()
    level = models.CharField(max_length=10, default='easy')
    
    class Meta:
        constraints =[
            models.UniqueConstraint(fields=['id', 'user_id'], name='unique_problem_id_user_id')
        ]
        
class Algorithm(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    
class ProblemAlgorithm(models.Model):
    problem_id = models.models.ForeignKey(Problem, to_field='id', on_delete=models.CASCADE)
    algorithm_id = models.models.ForeignKey(Algorithm, to_field='id', on_delete=models.CASCADE)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['problem_id', 'algorithm_id'], name='unique_problem_id_algorithm_id')
        ]
        
@receiver(post_migrate)
def add_default_algorithm(sender, **kwargs):
    #TODO fill algorithms
    pass