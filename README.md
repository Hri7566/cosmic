# Cosmic

This project is an entertainment program designed to support input and output from multiple services at the same time.

This project was created on July 31, 2022.

## Contrubutors

- Hri7566: Author & creator of Cosmic

## Building

*Please* only run this under POSIX-based environments. The yarn scripts just call shell scripts for POSIX-based environments and everything would have to be done by hand on Windows.

This project uses TypeScript and esbuild. Originally, there was planned support for C, Nim, and Deno integration, but interoperability has been deprecated to keep the project maintainable.

```sh
$ yarn
# Install all required packages
```

```sh
$ yarn build
# Build everything
```

```sh
$ yarn start
# Start the program
```

```sh
$ yarn dev
# Build everything and start
```
