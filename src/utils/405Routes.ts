import { IRouter } from 'express';

const add405ResponseToRouter = (router: IRouter) => {
  const routes = router.stack.map(layer => layer.route);

  for (const route of routes) {
    const { path, methods } = route;
    router.route(path).all(function methodNotAllowed(req, res, next) {
      res.set(
        'Allow',
        Object.keys(methods)
          .filter(method => method !== '_all')
          .map(method => method.toUpperCase())
          .join(', ')
      );
      res.status(405).send();
    });
  }

  return router;
};

export default add405ResponseToRouter;
