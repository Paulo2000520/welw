const User = require('../models/User');
// const Employee = require('../models/Employee');
const Store = require('../models/Store');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const { BadRequestError } = require('../errors');
const crypto = require('crypto');

const seller = async (req, res) => {
   const { name, email, password } = req.body;

   if (!req.file) {
      throw new BadRequestError(
         'Envie uma imagem da sua alvará de comerciante.'
      );
   }

   const alvaraName = `${Date.now()}${path.extname(req.file.originalname)}`;

   const newSeller = new User({
      role: 'vendedor(a)',
      name,
      email,
      password,
      alvara: `/uploads/alvaras/${alvaraName}`,
   });

   await newSeller.save();

   const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'alvaras',
      alvaraName
   );

   fs.writeFileSync(uploadPath, req.file.buffer);

   const token = newSeller.createJWT();

   res.status(StatusCodes.CREATED).json({
      user: {
         msg: 'Conta cadastrada com sucesso!',
         name: newSeller.name,
         role: newSeller.role,
      },
      token,
   });
};

module.exports = { seller };
