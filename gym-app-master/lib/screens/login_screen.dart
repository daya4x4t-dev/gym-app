import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../utils/auth_background.dart';
import '../utils/app_theme.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_textfield.dart';
import 'signup_screen.dart';
import 'forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {

  late final AnimationController _logoCtrl;
  late final Animation<double> _logoAnim;

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoading = false;

  @override
  void initState() {
    super.initState();

    _logoCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..forward();

    _logoAnim = CurvedAnimation(parent: _logoCtrl, curve: Curves.easeIn);
  }

  @override
  void dispose() {
    _logoCtrl.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future login() async {

    setState(() {
      isLoading = true;
    });

    try {

      final response = await http.post(
        Uri.parse("http://127.0.0.1:5000/auth/login"),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "email": emailController.text.trim(),
          "password": passwordController.text.trim(),
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Login Successful")),
        );

        print(data);

      } else {

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data["error"] ?? "Login Failed")),
        );

      }

    } catch (e) {

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );

    } finally {

      setState(() {
        isLoading = false;
      });

    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthBackground(
      child: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [

                FadeTransition(
                  opacity: _logoAnim,
                  child: const Padding(
                    padding: EdgeInsets.only(bottom: 24),
                    child: Text(
                      'NIP',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 58,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 10,
                      ),
                    ),
                  ),
                ),

                ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                    child: Container(
                      decoration: AppTheme.glassCard(),
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [

                          const Text(
                            'Welcome Back',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                            ),
                          ),

                          const SizedBox(height: 4),

                          const Text(
                            'Sign in to continue your journey',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 14,
                            ),
                          ),

                          const SizedBox(height: 30),

                          CustomTextField(
                            hint: 'Email address',
                            controller: emailController,
                            keyboardType: TextInputType.emailAddress,
                            prefixIcon: const Icon(Icons.email_outlined,
                                color: Colors.white54, size: 19),
                          ),

                          const SizedBox(height: 14),

                          CustomTextField(
                            hint: 'Password',
                            controller: passwordController,
                            isPassword: true,
                            prefixIcon: const Icon(Icons.lock_outline,
                                color: Colors.white54, size: 19),
                          ),

                          const SizedBox(height: 8),

                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () => Navigator.push(
                                context,
                                AppTheme.fadeSlideRoute(
                                  const ForgotPasswordScreen(),
                                ),
                              ),
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: Color(0xFFFF2E2E),
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 10),

                          isLoading
                              ? const Center(
                                  child: CircularProgressIndicator(),
                                )
                              : CustomButton(
                                  text: 'SIGN IN',
                                  onTap: login,
                                ),

                          const SizedBox(height: 22),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                "Don't have an account? ",
                                style: TextStyle(color: Colors.white54),
                              ),
                              GestureDetector(
                                onTap: () => Navigator.push(
                                  context,
                                  AppTheme.fadeSlideRoute(
                                    const SignupScreen(),
                                  ),
                                ),
                                child: const Text(
                                  'Sign Up',
                                  style: TextStyle(
                                    color: Colors.white,
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}