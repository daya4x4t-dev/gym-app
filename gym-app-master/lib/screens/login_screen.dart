import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../utils/auth_background.dart';
import '../utils/app_theme.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_textfield.dart';
import 'forgot_password_screen.dart';
import 'home_screen.dart';
import 'signup_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (emailController.text.trim().isEmpty || passwordController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Email and password are required')));
      return;
    }

    try {
      await context.read<AuthProvider>().login(emailController.text.trim(), passwordController.text.trim());
      if (!mounted) return;
      Navigator.pushReplacement(context, AppTheme.fadeSlideRoute(const HomeScreen()));
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login failed. Please try again.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return AuthBackground(
      child: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  decoration: AppTheme.glassCard(),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      const Text('Welcome Back', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                      const SizedBox(height: 24),
                      CustomTextField(hint: 'Email', controller: emailController),
                      const SizedBox(height: 14),
                      CustomTextField(hint: 'Password', controller: passwordController, isPassword: true, onSubmitted: (_) => _login()),
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () => Navigator.push(context, AppTheme.fadeSlideRoute(const ForgotPasswordScreen())),
                          child: const Text('Forgot Password?', style: TextStyle(color: Color(0xFFFF2E2E))),
                        ),
                      ),
                      const SizedBox(height: 8),
                      auth.isLoading ? const CircularProgressIndicator(color: Color(0xFFFF2E2E)) : CustomButton(text: 'Login', onTap: _login),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () => Navigator.push(context, AppTheme.fadeSlideRoute(const SignupScreen())),
                        child: const Text('Create account', style: TextStyle(color: Colors.white70)),
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
