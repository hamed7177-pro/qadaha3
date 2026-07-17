from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "national_id", "phone", "email", "role"]

    def get_role(self, obj):
        roles_mapping = {
            1: "موظف قطاع خاص",
            2: "كاتب محتوى حر",
            3: "مصور فوتوغرافي مستقل",
            4: "مصمم تجربة مستخدم حر",
            5: "موظف حكومي",
            6: "مترجم حر",
            7: "مصمم مستقل"
        }
        return roles_mapping.get(obj.id, "عمل حر")