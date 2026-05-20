import 'package:flutter/material.dart';

import '../../../../constants/image_strings.dart';
import '../../../../constants/text_strings.dart';

class loginHeaderWidget extends StatelessWidget {
  const loginHeaderWidget({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Size = MediaQuery.of(context).size;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Image(
          image: const AssetImage(tlogo),
          height: Size.height * 0.1,
        ),
        Text(
          tAppName,
          style: Theme.of(context).textTheme.displayMedium,
        ),
        Text(
          tAppSlag,
          style: Theme.of(context).textTheme.displaySmall,
        ),
      ],
    );
  }
}
