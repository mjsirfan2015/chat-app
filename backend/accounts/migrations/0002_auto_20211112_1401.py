# Generated by Django 3.2.9 on 2021-11-12 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('about', models.CharField(max_length=250)),
            ],
        ),
        migrations.AddField(
            model_name='requesttable',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
