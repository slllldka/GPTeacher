from django.db import models

# Create your models here.

class Problem(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    level = models.CharField(max_length=10)

class Algorithm(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    
class ProblemAlgorithm(models.Model):
    problem_id = models.models.ForeignKey(Problem, to_field='id', on_delete=models.CASCADE)
    algorithm_id = models.models.ForeignKey(Algorithm, to_field='id', on_delete=models.CASCADE)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['problem_id', 'algorithm_id'], name = 'unique_problem_id_algorithm_id')
        ]