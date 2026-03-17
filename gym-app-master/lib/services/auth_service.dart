import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  final _api = ApiService.instance;
  static const _tokenKey = 'auth_token';
  static const _userKey = 'current_user';

  Future<dynamic> signup(String username, String email, String password) async =>
      _api.post('/auth/signup', body: {'username': username, 'email': email, 'password': password});

  Future<dynamic> login(String email, String password) async {
    final res = await _api.post('/auth/login', body: {'email': email, 'password': password});
    final token = res['data']?['token'] as String?;
    if (token != null) await saveToken(token);
    return res;
  }

  Future<dynamic> logout() async {
    await clearToken();
    return {'success': true};
  }

  Future<dynamic> forgotPassword(String email) async => _api.post('/auth/forgot-password', body: {'email': email});
  Future<dynamic> verifyOtp(String email, String token) async =>
      _api.post('/auth/verify-otp', body: {'email': email, 'token': token});
  Future<dynamic> resetPassword(String password, String accessToken) async =>
      _api.post('/auth/reset-password', body: {'password': password, 'accessToken': accessToken});
  Future<dynamic> getCurrentUser(String userId) async => _api.get('/auth/profile?userId=$userId');

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
}
