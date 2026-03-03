import 'package:flutter/material.dart';
import 'painters.dart';
import 'app_theme.dart';

/// Full-screen animated background for all auth screens.
///
/// Layer order (bottom → top):
///  1. Gym background image (full cover)
///  2. Dark overlay (65% black) — keeps the card legible
///  3. Subtle red gradient overlay — matches the app's red theme
///  4. Breathing opacity wrapper — gentle pulse on the overlays
///  5. Cinematic light streak (slow pan)
///  6. Diagonal red lines + floating particles (existing effect)
///  7. Screen content (login card, etc.)
class AuthBackground extends StatefulWidget {
  final Widget child;
  const AuthBackground({super.key, required this.child});

  @override
  State<AuthBackground> createState() => _AuthBackgroundState();
}

class _AuthBackgroundState extends State<AuthBackground>
    with TickerProviderStateMixin {
  // Breathing animation: fades brightness slightly in & out (7 s per half-cycle)
  late final AnimationController _breathCtrl;
  late final Animation<double> _breathOpacity;

  // Streak / particle animation (unchanged 12 s cycle)
  late final AnimationController _loopCtrl;

  // Slow streak sweep: one full pass every 22 seconds
  late final AnimationController _streakCtrl;

  // Cinematic zoom animation
  late final AnimationController _zoomCtrl;
  late final Animation<double> _zoomAnim;

  @override
  void initState() {
    super.initState();

    // ── Breathing ──────────────────────────────────────────────────────────
    _breathCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 7),
    )..repeat(reverse: true);

    _breathOpacity = Tween<double>(begin: 0.82, end: 1.0).animate(
      CurvedAnimation(parent: _breathCtrl, curve: Curves.easeInOut),
    );

    // ── Loop (diagonal lines + particles) ────────────────────────────────
    _loopCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();

    // ── Light streak (slow pan) ───────────────────────────────────────────
    _streakCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 22),
    )..repeat();

    // ── Cinematic Zoom ───────────────────────────────────────────────────
    _zoomCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat(reverse: true);

    _zoomAnim = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _zoomCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _breathCtrl.dispose();
    _loopCtrl.dispose();
    _streakCtrl.dispose();
    _zoomCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: AnimatedBuilder(
        animation: Listenable.merge([_breathCtrl, _loopCtrl, _streakCtrl, _zoomCtrl]),
        builder: (context, _) {
          return Stack(
            fit: StackFit.expand,
            children: [
              // ── 1. Gym background image (Zooming) ─────────────────────
              Transform.scale(
                scale: _zoomAnim.value,
                child: Image.asset(
                  'assets/images/eb4cefe0c24c3e3010394ae4bfd3c9b8.jpg',
                  fit: BoxFit.cover,
                  alignment: Alignment.topCenter,
                ),
              ),

              // ── 2. Dark overlay (breathes very slightly) ──────────────
              Opacity(
                opacity: _breathOpacity.value,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.65),
                  ),
                ),
              ),

              // ── 3. Red gradient tint (bottom → transparent top) ───────
              Opacity(
                opacity: _breathOpacity.value,
                child: const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Color(0x338B0000), // deep crimson, 20% at bottom
                        Color(0x1AFF2E2E), // accent red, 10% mid
                        Colors.transparent,
                      ],
                      stops: [0.0, 0.45, 1.0],
                    ),
                  ),
                ),
              ),

              // ── 4. Cinematic light streak ─────────────────────────────
              CustomPaint(
                painter: LightStreakPainter(
                  progress: _streakCtrl.value,
                  opacity: _breathOpacity.value,
                ),
                child: const SizedBox.expand(),
              ),

              // ── 5. Diagonal red-tinted animated lines ─────────────────
              CustomPaint(
                painter: DiagonalLightPainter(progress: _loopCtrl.value),
                child: const SizedBox.expand(),
              ),

              // ── 6. Floating micro-particles ───────────────────────────
              CustomPaint(
                painter: ParticlePainter(progress: _loopCtrl.value),
                child: const SizedBox.expand(),
              ),

              // ── 7. Screen content ─────────────────────────────────────
              widget.child,
            ],
          );
        },
      ),
    );
  }
}
