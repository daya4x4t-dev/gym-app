import 'api_service.dart';

class ProgressService {
  final _api = ApiService.instance;
  Future<dynamic> getProgress(String userId) => _api.get('/progress/$userId');
  Future<dynamic> logProgress(Map<String, dynamic> data) => _api.post('/progress', body: data);
  Future<dynamic> getLatestProgress(String userId) => _api.get('/progress/$userId/latest');
  Future<dynamic> deleteProgress(String progressId) => _api.delete('/progress/$progressId');
}
