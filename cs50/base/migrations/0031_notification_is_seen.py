# Generated by Django 5.1.4 on 2025-01-07 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0030_post_isprivate'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='is_seen',
            field=models.BooleanField(default=False),
        ),
    ]
