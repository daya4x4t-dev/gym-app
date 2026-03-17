import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'auth_service.dart';

class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  static String get baseUrl =>
      kIsWeb ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

  Future<Map<String, String>> _headers() async {
    final token = await AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> get(String path) async =>
      _handle(await http.get(Uri.parse('$baseUrl$path'), headers: await _headers()).timeout(const Duration(seconds: 15)));

  Future<dynamic> post(String path, {Map<String, dynamic>? body}) async => _handle(
      await http
          .post(Uri.parse('$baseUrl$path'), headers: await _headers(), body: jsonEncode(body ?? {}))
          .timeout(const Duration(seconds: 15)));

  Future<dynamic> put(String path, {Map<String, dynamic>? body}) async => _handle(
      await http
          .put(Uri.parse('$baseUrl$path'), headers: await _headers(), body: jsonEncode(body ?? {}))
          .timeout(const Duration(seconds: 15)));

  Future<dynamic> delete(String path, {Map<String, dynamic>? body}) async => _handle(
      await http
          .delete(Uri.parse('$baseUrl$path'), headers: await _headers(), body: jsonEncode(body ?? {}))
          .timeout(const Duration(seconds: 15)));

  dynamic _handle(http.Response response) {
    final decoded = response.body.isNotEmpty ? jsonDecode(response.body) : {};
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return decoded;
    }
    throw Exception(decoded['message'] ?? 'Request failed. Please try again.');
  }
}
