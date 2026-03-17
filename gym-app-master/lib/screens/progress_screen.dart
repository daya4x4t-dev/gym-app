import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Progress')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SizedBox(
            height: 220,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                borderData: FlBorderData(show: false),
                titlesData: const FlTitlesData(show: false),
                lineBarsData: [
                  LineChartBarData(spots: const [FlSpot(0, 80), FlSpot(1, 79), FlSpot(2, 78.5)], isCurved: true, color: const Color(0xFFFF2E2E)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Card(child: ListTile(title: Text('Current Weight'))),
          const Card(child: ListTile(title: Text('Starting Weight'))),
          const Card(child: ListTile(title: Text('Total Change'))),
        ],
      ),
    );
  }
}
