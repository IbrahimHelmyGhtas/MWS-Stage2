# git-serve
A simple CLI to serve a directory of git repos over http.


### Install
##### Make sure Git is installed and in your PATH so git-upload-pack and git-receive-pack can be found.

```sh
$ npm install git-serve -g
```

## Command Line Interface

```sh
  Usage: git-serve [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -p, --port <number>     Set port number to listen on.
    -d, --directory <path>  Set directory of repos to serve.
    -v, --verbose           Set logging to verbose
```

