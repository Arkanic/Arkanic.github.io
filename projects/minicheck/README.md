# minicheck
Tiniest JS testing framework. Designed to be prepended to a JS file.

## Example Usage:

Say we have this add function:
```JS
function add(a, b) {
    return a + b;
}
```

We can use this following code to check it:
```JS
// copy/paste minicheck.min.js here, or use a <script> tag to load it seperately

minicheck({
    "test adding function":() => {
        equals(
            add(3, 4), // the returned result
            7, // the expected result 
            "Adder doesn't work" // the message to send if it doesn't work
        );
        equals(
            add(5.5, 4.5),
            10,
            "Adder doesn't work"
        );
    }
});
```

## Reference
`minicheck.js` has jsdoc references, so if you are loading using a `<script>` tag it is recommended to use this file.

```JS
// force a failiure
fail(message);

// does value exist?
exists(value, message);

// does expected == real?
equals(real, expected, message);

// does string match this string or regex?
match(value, match, message);
```