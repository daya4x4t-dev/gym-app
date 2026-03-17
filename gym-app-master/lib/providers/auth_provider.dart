import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final _authService = AuthService();
  Map<String, dynamic>? currentUser;
  bool isLoading = false;

  bool get isLoggedIn => currentUser != null;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('user_email');
    final id = prefs.getString('user_id');
    if (email != null && id != null) {
      currentUser = {'email': email, 'id': id};
      notifyListeners();
    }
  }

  Future<void> login(String email, String password) async {
    isLoading = true;
    notifyListeners();
    try {
      final response = await _authService.login(email, password);
      final user = response['data']?['user'];
      currentUser = user == null ? null : Map<String, dynamic>.from(user);
      final prefs = await SharedPreferences.getInstance();
      if (currentUser != null) {
        await prefs.setString('user_email', currentUser!['email'] ?? '');
        await prefs.setString('user_id', currentUser!['id'] ?? '');
      }
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signup(String username, String email, String password) async {
    isLoading = true;
    notifyListeners();
    try {
      await _authService.signup(username, email, password);
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    isLoading = true;
    notifyListeners();
    try {
      await _authService.logout();
      currentUser = null;
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user_email');
      await prefs.remove('user_id');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
