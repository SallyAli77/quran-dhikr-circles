import 'package:flutter/material.dart';

import '../the_wall/model/pages/Sadka.dart';

class SadkaWall extends StatefulWidget {
  const SadkaWall({super.key});

  @override
  State<SadkaWall> createState() => _SadkaWallState();
}

class _SadkaWallState extends State<SadkaWall> {
  @override
  Widget build(BuildContext context) {
    return const Sadka();
  }
}
