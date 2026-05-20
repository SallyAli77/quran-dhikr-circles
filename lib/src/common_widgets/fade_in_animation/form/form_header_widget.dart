import 'package:flutter/material.dart';

class FormHeaderWidget extends StatelessWidget {
  const FormHeaderWidget({
    Key? key,
    this.imageColor,
    this.heightBetween,
    required this.image,
    required this.title,
    required this.subtitle,
    this.imageHeight = 0.2,
    this.crossAxisAlignment = CrossAxisAlignment.start,
    this.textAlign,
  }) : super(key: key);

  final String image, title, subtitle;
  final Color? imageColor;
  final double? heightBetween;
  final double? imageHeight;
  final CrossAxisAlignment? crossAxisAlignment;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) {
    final Size = MediaQuery.of(context).size;

    return Column(
      crossAxisAlignment: crossAxisAlignment!,
      children: [
        Image(
          image: AssetImage(image),
          height: Size.height * 0.1,
        ),
        Text(
          title,
          textAlign: textAlign,
          style: Theme.of(context).textTheme.displayMedium,
        ),
        Text(
          subtitle,
          textAlign: textAlign,
          style: Theme.of(context).textTheme.displaySmall,
        ),
      ],
    );
  }
}
