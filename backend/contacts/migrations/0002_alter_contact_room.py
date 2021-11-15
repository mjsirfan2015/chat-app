# Generated by Django 3.2.9 on 2021-11-13 03:24

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='room',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
