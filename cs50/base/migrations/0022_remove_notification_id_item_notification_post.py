# Generated by Django 5.1.4 on 2024-12-28 17:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0021_notification_id_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='id_item',
        ),
        migrations.AddField(
            model_name='notification',
            name='post',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='base.post'),
            preserve_default=False,
        ),
    ]
