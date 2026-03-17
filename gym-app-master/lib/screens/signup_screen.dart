import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'; // ✅ for kIsWeb
import 'package:http/http.dart' as http;

import '../utils/auth_background.dart';
import '../utils/app_theme.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_textfield.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoading = false;

  // ✅ Auto-detect platform — works on both Chrome and Android Emulator
  static final String baseUrl = kIsWeb
      ? "http://localhost:5000"
      : "http://10.0.2.2:5000";

  // =======================
  // ✅ VALIDATION
  // =======================
  String? _validate() {
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (name.isEmpty) return "Full name is required";
    if (email.isEmpty) return "Email is required";
    if (!RegExp(r'^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
      return "Enter a valid email address";
    }
    if (password.isEmpty) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";

    return null;
  }

  // =======================
  // ✅ SHOW SNACKBAR HELPER
  // =======================
  void _showSnackbar(String message, {bool isError = true}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.redAccent : Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  // =======================
  // ✅ SIGNUP
  // =======================
  Future<void> signup() async {
    final error = _validate();
    if (error != null) {
      _showSnackbar(error);
      return;
    }

    setState(() => isLoading = true);

    try {
      final response = await http
          .post(
            Uri.parse("$baseUrl/auth/signup"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode({
              "username": nameController.text.trim(),
              "email": emailController.text.trim(),
              "password": passwordController.text.trim(),
            }),
          )
          .timeout(
            const Duration(seconds: 15),
            onTimeout: () =>
                throw Exception("Connection timed out. Is the server running?"),
          );

      if (!mounted) return;

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        _showSnackbar(
          data["message"] ?? "Account created! Please verify your email.",
          isError: false,
        );
        Navigator.pop(context);
      } else {
        _showSnackbar(data["message"] ?? "Signup failed. Please try again.");
      }
    } catch (e) {
      if (!mounted) return;

      String errorMessage = "Something went wrong";

      if (e.toString().contains("timed out")) {
        errorMessage = "Connection timed out. Check if server is running.";
      } else if (e.toString().contains("SocketException") ||
          e.toString().contains("Failed to fetch")) {
        errorMessage = "Cannot connect to server. Check your connection.";
      } else {
        errorMessage = e.toString().replaceAll("Exception: ", "");
      }

      _showSnackbar(errorMessage);
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AuthBackground(
      child: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: Container(
                  decoration: AppTheme.glassCard(),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 🏷️ TITLE
                      const Text(
                        'Create Account',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Start your fitness journey today',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.45),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 30),

                      // 👤 NAME
                      CustomTextField(
                        hint: 'Full Name',
                        controller: nameController,
                        prefixIcon: const Icon(Icons.person_outline,
                            color: Colors.white54, size: 19),
                        textInputAction: TextInputAction.next,
                      ),
                      const SizedBox(height: 14),

                      // 📧 EMAIL
                      CustomTextField(
                        hint: 'Email address',
                        controller: emailController,
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: const Icon(Icons.email_outlined,
                            color: Colors.white54, size: 19),
                        textInputAction: TextInputAction.next,
                      ),
                      const SizedBox(height: 14),

                      // 🔒 PASSWORD
                      CustomTextField(
                        hint: 'Password',
                        controller: passwordController,
                        isPassword: true,
                        prefixIcon: const Icon(Icons.lock_outline,
                            color: Colors.white54, size: 19),
                        textInputAction: TextInputAction.done,
                        onSubmitted: (_) => signup(),
                      ),
                      const SizedBox(height: 28),

                      // 🔘 BUTTON
                      isLoading
                          ? const Center(
                              child: CircularProgressIndicator(
                                color: Colors.red,
                              ),
                            )
                          : CustomButton(
                              text: 'CREATE ACCOUNT',
                              onTap: signup,
                            ),
                      const SizedBox(height: 22),

                      // 🔗 SIGN IN LINK
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Already have an account? ",
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.5),
                              fontSize: 14,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: const Text(
                              'Sign In',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}