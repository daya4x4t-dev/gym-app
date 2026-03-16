import 'dart:ui';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../utils/auth_background.dart';
import '../utils/app_theme.dart';
import '../widgets/custom_button.dart';
import 'reset_password_screen.dart';

class OtpScreen extends StatefulWidget {
  final String email;

  const OtpScreen({super.key, required this.email});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {

  final TextEditingController otpController = TextEditingController();
  bool isLoading = false;

  Future verifyOtp() async {

    final otp = otpController.text.trim();

    if (otp.length != 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Enter the 8 digit OTP")),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {

      final response = await http.post(
        Uri.parse("http://127.0.0.1:5000/auth/verify-otp"),
        headers: {
          "Content-Type": "application/json"
        },
        body: jsonEncode({
          "email": widget.email,
          "otp": otp
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {

        final token = data["session"]["access_token"];

        Navigator.push(
          context,
          AppTheme.fadeSlideRoute(
            ResetPasswordScreen(token: token),
          ),
        );

      } else {

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data["error"] ?? "Invalid OTP")),
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
  void dispose() {
    otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    return AuthBackground(
      child: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
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

                      const Text(
                        'Verification Code',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                        ),
                      ),

                      const SizedBox(height: 6),

                      const Text(
                        'Enter the code sent to your email',
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 30),

                      TextField(
                        controller: otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 8,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          letterSpacing: 6,
                          fontWeight: FontWeight.bold,
                        ),
                        decoration: InputDecoration(
                          counterText: "",
                          hintText: "--------",
                          hintStyle: const TextStyle(color: Colors.white38),
                          filled: true,
                          fillColor: const Color(0xFF1A1A1A),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),

                      const SizedBox(height: 28),

                      isLoading
                          ? const Center(child: CircularProgressIndicator())
                          : CustomButton(
                              text: "VERIFY",
                              onTap: verifyOtp,
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