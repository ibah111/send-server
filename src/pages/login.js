/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("sequelize").Sequelize} sql
 */
export const call = (fastify, sql) => {
  /**
   *
   * @param {import("fastify").FastifyRequest} req
   * @param {import("fastify").FastifyReply} res
   */
  return async (req, res) => {
    const body = req.body;
    return "Ok";
  };
};
export const name = "login";
