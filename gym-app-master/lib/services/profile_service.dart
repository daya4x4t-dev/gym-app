import 'dart:io';
import 'dart:convert';
import 'api_service.dart';

class ProfileService {
  final _api = ApiService.instance;
  Future<dynamic> getProfile(String userId) => _api.get('/api/profile/$userId');
  Future<dynamic> updateProfile(String userId, Map<String, dynamic> data) => _api.put('/api/profile/$userId', body: data);
  Future<dynamic> uploadPhoto(String userId, File imageFile) async {
    final bytes = await imageFile.readAsBytes();
    return _api.post('/api/profile/$userId/photo', body: {'avatar_base64': base64Encode(bytes)});
  }

  Future<dynamic> deletePhoto(String userId) => _api.delete('/api/profile/$userId/photo');
}
