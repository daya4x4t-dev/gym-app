import 'package:flutter/material.dart';

class AppTheme {
  // Colors
  static const Color background = Color(0xFF0D0D0D);
  static const Color cardBg = Color(0x0DFFFFFF); // white 5%
  static const Color fieldBg = Color(0xFF1A1A1A);
  static const Color gradientStart = Color(0xFF8B0000);
  static const Color gradientEnd = Color(0xFFFF2E2E);
  static const Color accentRed = Color(0xFFFF2E2E);

  static const LinearGradient buttonGradient = LinearGradient(
    colors: [gradientStart, gradientEnd],
  );

  // Glassmorphism card decoration
  static BoxDecoration glassCard({double radius = 24}) => BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 24,
            spreadRadius: 0,
            offset: const Offset(0, 8),
          ),
        ],
      );

  // Smooth fade + slide page route
  static PageRouteBuilder<T> fadeSlideRoute<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: const Duration(milliseconds: 400),
      reverseTransitionDuration: const Duration(milliseconds: 300),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final fadeCurve = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOut,
        );
        final slideCurve = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
        );
        return FadeTransition(
          opacity: fadeCurve,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.06, 0),
              end: Offset.zero,
            ).animate(slideCurve),
            child: child,
          ),
        );
      },
    );
  }
}
