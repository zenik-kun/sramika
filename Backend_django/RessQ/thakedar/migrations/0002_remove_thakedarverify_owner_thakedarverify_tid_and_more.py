# Generated by Django 5.1.6 on 2025-02-28 22:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('thakedar', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='thakedarverify',
            name='owner',
        ),
        migrations.AddField(
            model_name='thakedarverify',
            name='tid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='thakedar.thakedar'),
        ),
        migrations.AlterField(
            model_name='sarmika',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='sermikaverify',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='thakedar.sarmika'),
        ),
        migrations.AlterField(
            model_name='thakedar',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
