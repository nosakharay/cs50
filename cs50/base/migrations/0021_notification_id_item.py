# Generated by Django 5.1.4 on 2024-12-28 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0020_notification_associated_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='id_item',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
