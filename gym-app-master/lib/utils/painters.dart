import 'dart:math' as math;
import 'package:flutter/material.dart';

// ── Diagonal animated red-tinted light lines ─────────────────────────────────
class DiagonalLightPainter extends CustomPainter {
  final double progress;
  DiagonalLightPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0x11FF2D55)
      ..strokeWidth = 1.5;

    for (int i = -10; i < 20; i++) {
      double offset = i * 100 + (progress * 200) % 1000;
      canvas.drawLine(
        Offset(offset, -100),
        Offset(offset - size.height * 0.7, size.height + 100),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(DiagonalLightPainter oldDelegate) => true;
}

// ── Floating micro-particles ──────────────────────────────────────────────────
class ParticlePainter extends CustomPainter {
  final double progress;
  ParticlePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white.withValues(alpha: 0.12);
    final random = math.Random(42);

    for (int i = 0; i < 35; i++) {
      final x = random.nextDouble() * size.width;
      final y = (random.nextDouble() * size.height + (progress * 120)) % size.height;
      final radius = random.nextDouble() * 1.0 + 0.3;
      canvas.drawCircle(Offset(x, y), radius, paint);
    }
  }

  @override
  bool shouldRepaint(ParticlePainter oldDelegate) => true;
}

// ── Cinematic slow-moving light streak ───────────────────────────────────────
/// Renders a single wide, soft diagonal streak that glides slowly across the
/// screen. At full [progress] = 1.0 the streak has completed one full pass.
/// Combine with a repeating AnimationController for a continuous cinematic feel.
class LightStreakPainter extends CustomPainter {
  final double progress;   // 0.0 → 1.0, driven by a slow repeating controller
  final double opacity;    // overall opacity (drive with breathing animation)

  LightStreakPainter({required this.progress, this.opacity = 1.0});

  @override
  void paint(Canvas canvas, Size size) {
    // The streak travels from well off the left edge to well off the right edge.
    // We map progress 0→1 to x = -width → 2*width so it fully enters and exits.
    final centerX = -size.width + progress * size.width * 3;
    const angleRad = -math.pi / 5.5; // ~32° diagonal tilt

    // Streak width and height span
    const streakHalfWidth = 60.0;
    final streakHeight = size.height * 1.6;

    // Build the streak rectangle centred on (centerX, height/2), rotated.
    final rect = Rect.fromCenter(
      center: Offset(centerX, size.height / 2),
      width: streakHalfWidth * 2,
      height: streakHeight,
    );

    // Gradient: opaque centre → transparent edges (feathered)
    final gradient = LinearGradient(
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
      colors: [
        Colors.transparent,
        Colors.white.withValues(alpha: 0.045 * opacity),
        Colors.white.withValues(alpha: 0.09 * opacity),
        Colors.white.withValues(alpha: 0.045 * opacity),
        Colors.transparent,
      ],
      stops: const [0.0, 0.3, 0.5, 0.7, 1.0],
    );

    final paint = Paint()
      ..shader = gradient.createShader(rect)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18);

    canvas.save();
    canvas.translate(centerX, size.height / 2);
    canvas.rotate(angleRad);
    canvas.translate(-centerX, -size.height / 2);
    canvas.drawRect(rect, paint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(LightStreakPainter old) =>
      old.progress != progress || old.opacity != opacity;
}
