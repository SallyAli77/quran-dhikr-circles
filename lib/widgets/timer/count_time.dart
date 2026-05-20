import 'dart:async';

import 'package:flutter/material.dart';

import 'button_start.dart';

class CountdownTimerBar extends StatefulWidget {
  final String time;
  final ImageProvider<Object> indicatorImage;

  const CountdownTimerBar({
    super.key,
    required this.time,
    required this.indicatorImage,
  });

  @override
  _CountdownTimerBarState createState() => _CountdownTimerBarState();
}

class _CountdownTimerBarState extends State<CountdownTimerBar> {
  late int secondsRemaining;
  bool isCountingDown = false;

  @override
  void initState() {
    super.initState();
    secondsRemaining = getSecondsFromTime(widget.time);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: Container(
                margin: const EdgeInsets.only(left: 10),
                height: 30,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(25.0),
                  gradient: const LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: [
                      Color.fromARGB(255, 95, 77, 32),
                      Color.fromARGB(213, 213, 177, 99)
                    ],
                  ),
                ),
                child: Stack(children: [
                  FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor:
                        secondsRemaining / getSecondsFromTime(widget.time),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10.0),
                        gradient: const LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [Colors.green, Colors.lightGreen],
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    right: 0,
                    child: Image(
                      image: widget.indicatorImage,
                      width: 30,
                      height: 30,
                      fit: BoxFit.cover,
                    ),
                  ),
                ]),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.only(right: 10),
              child: Text(formatTime(secondsRemaining),
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        CustomElevatedButton(
          isCountingDown: isCountingDown,
          startCountdown: startCountdown,
        ),
      ],
    );
  }

  void startCountdown() {
    setState(() {
      isCountingDown = true;
    });

    const oneSec = Duration(seconds: 1);
    final totalSeconds = getSecondsFromTime(widget.time);
    Timer.periodic(oneSec, (Timer timer) {
      if (secondsRemaining <= 0) {
        timer.cancel();
        setState(() {
          isCountingDown = false;
        });
      } else {
        setState(() {
          secondsRemaining--;
        });
      }
    });
  }

  int getSecondsFromTime(String time) {
    final parts = time.split(':');
    final minutes = int.parse(parts[0]);
    final seconds = int.parse(parts[1]);
    return minutes * 60 + seconds;
  }

  String formatTime(int seconds) {
    final minutes = (seconds ~/ 60).toString().padLeft(2, '0');
    final remainingSeconds = (seconds % 60).toString().padLeft(2, '0');
    return '$minutes:$remainingSeconds';
  }
}
